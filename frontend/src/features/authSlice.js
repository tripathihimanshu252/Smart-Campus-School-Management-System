import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- HELPER FUNCTION ---
const getAuthConfigHeaders = () => {
  const token = localStorage.getItem('userToken');
  const tenant = localStorage.getItem('activeSchoolId') || localStorage.getItem('tenantMapping') || 'CLUSTER-AI-DS';
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'x-tenant-id': tenant.toUpperCase().trim()
    }
  };
};

// --- 1. ASYNC THUNKS ---

export const fetchStudents = createAsyncThunk('auth/fetchStudents', async (tenantMapping, { rejectWithValue }) => {
  try {
    const activeTenant = tenantMapping || localStorage.getItem('activeSchoolId') || 'CLUSTER-AI-DS';
    const response = await axios.get(`${API_URL}/students?tenantId=${activeTenant}`, getAuthConfigHeaders());
    localStorage.setItem(`students_${activeTenant}`, JSON.stringify(response.data.data));
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchFleets = createAsyncThunk('auth/fetchFleets', async (tenantId, { rejectWithValue }) => {
  try {
    const activeTenant = tenantId || localStorage.getItem('activeSchoolId') || 'CLUSTER-AI-DS';
    const response = await axios.get(`${API_URL}/fleets?tenantId=${activeTenant}`, getAuthConfigHeaders());
    localStorage.setItem(`buses_${activeTenant}`, JSON.stringify(response.data.data));
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// 🔥 FIX: Faculties ko Redux aur LocalStorage dono mein sync karo taaki "Registry Empty" na aaye
export const fetchFaculties = createAsyncThunk('auth/fetchFaculties', async (tenantId, { rejectWithValue }) => {
  try {
    const activeTenant = tenantId || localStorage.getItem('activeSchoolId') || 'CLUSTER-AI-DS';
    const response = await axios.get(`${API_URL}/admin/faculties?tenantId=${activeTenant}`, getAuthConfigHeaders());
    
    // LocalStorage mein save kar rahe hain taaki refresh par jaldi load ho
    localStorage.setItem(`faculties_${activeTenant}`, JSON.stringify(response.data.data));
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const registerStaffDB = createAsyncThunk('auth/registerStaffDB', async (staffData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register-staff`, staffData, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateStaffStatusDB = createAsyncThunk('auth/updateStaffStatusDB', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/admin/staff/${id}/status`, { status }, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const registerDirectorDB = createAsyncThunk('auth/registerDirectorDB', async (directorData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register-director`, directorData, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateAttendanceDB = createAsyncThunk('auth/updateAttendance', async ({ rollNumber, attendance }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/students/attendance`, { rollNumber, attendance }, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updatePerformanceDB = createAsyncThunk('auth/updatePerformanceDB', async ({ rollNumber, fieldKey, nextValue }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/students/performance-override`, { rollNumber, fieldKey, nextValue }, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateBusLocationDB = createAsyncThunk('auth/updateBusLocation', async ({ busNo, currentStop }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/fleets/location`, { busNo, currentStop }, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const registerStudentDB = createAsyncThunk('auth/registerStudentDB', async (studentData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register-student`, studentData, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchParentWardData = createAsyncThunk('auth/fetchParentWardData', async (parentEmail, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/parent/my-child/${parentEmail}`, getAuthConfigHeaders());
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// --- 2. INITIAL STATE ---
// 🔥 FIX: Faculties ko initialize karo localStorage se (taaki reload pe jaldi dikhe)
const activeTenant = localStorage.getItem('activeSchoolId') || localStorage.getItem('tenantMapping') || null;
const cachedFaculties = activeTenant ? JSON.parse(localStorage.getItem(`faculties_${activeTenant}`) || "[]") : [];

const initialState = {
  user: localStorage.getItem('userRole') ? { 
    role: localStorage.getItem('userRole'), 
    email: localStorage.getItem('activeUserEmail') || localStorage.getItem('userEmail'), 
    tenantMapping: localStorage.getItem('activeSchoolId') || localStorage.getItem('tenantMapping') 
  } : null,
  isAuthenticated: !!localStorage.getItem('userToken') || !!localStorage.getItem('activeUserEmail'),
  tenantMapping: activeTenant,
  schoolId: activeTenant,
  students: [], 
  fleetList: [], 
  faculties: cachedFaculties, // 🔥 Yahan add kiya
  currentWard: null, 
  status: 'idle'
};

// --- 3. REDUX SLICE ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const cleanEmail = (action.payload.email || '').toLowerCase().trim();
      const cleanTenant = String(action.payload.schoolId || action.payload.tenantId || 'CLUSTER-AI-DS').toUpperCase().trim();
      const cleanRole = action.payload.role || 'admin';
      
      state.user = { role: cleanRole, email: cleanEmail, tenantMapping: cleanTenant };
      state.isAuthenticated = true;
      state.tenantMapping = cleanTenant;
      state.schoolId = cleanTenant;

      localStorage.setItem('tenantMapping', cleanTenant);
      localStorage.setItem('activeSchoolId', cleanTenant);
      localStorage.setItem('tenantId', cleanTenant);
      localStorage.setItem('userToken', action.payload.token || '');
      localStorage.setItem('userRole', cleanRole);
      localStorage.setItem('activeUserEmail', cleanEmail);
      localStorage.setItem('userEmail', cleanEmail);
    },
    logoutSuccess: (state) => {
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
      state.tenantMapping = null;
      state.schoolId = null;
      state.currentWard = null;
      state.students = [];
      state.fleetList = [];
      state.faculties = []; // 🔥 Logout pe clear karo
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload || [];
      })
      .addCase(fetchFleets.fulfilled, (state, action) => {
        state.fleetList = action.payload || [];
      })
      .addCase(fetchFaculties.fulfilled, (state, action) => {
        state.faculties = action.payload || []; // 🔥 API se data aane pe update
      })
      .addCase(registerStaffDB.fulfilled, (state, action) => {
        if (action.payload) {
          state.faculties = [...(state.faculties || []), action.payload];
        }
      })
      .addCase(registerDirectorDB.fulfilled, (state, action) => {
        if (action.payload) {
          state.faculties = [...(state.faculties || []), action.payload];
        }
      })
      .addCase(updateStaffStatusDB.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.faculties = (state.faculties || []).map((staff) => staff._id === action.payload._id ? action.payload : staff);
      })
      .addCase(registerStudentDB.fulfilled, (state, action) => {
        if (action.payload) {
          state.students.push(action.payload);
        }
      })
      .addCase(updatePerformanceDB.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.students.findIndex(s => s.rollNumber === action.payload.rollNumber);
        if (index !== -1) {
          state.students[index] = action.payload; 
        }
      })
      .addCase(fetchParentWardData.fulfilled, (state, action) => {
          state.currentWard = action.payload;
      });
  }
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;