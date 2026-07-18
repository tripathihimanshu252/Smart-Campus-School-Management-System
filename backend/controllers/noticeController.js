const Notice = require('../models/notice');

// 1. Broadcast New Notice
const broadcastNotice = async (req, res) => {
    try {
        const { text, sender, audience, tenantId } = req.body;
        const newNotice = new Notice({
            text,
            sender,
            audience,
            tenantId,
            date: new Date().toLocaleDateString(),
            readBy: []
        });
        await newNotice.save();
        res.status(201).json({ success: true, message: "Notice broadcasted successfully", data: newNotice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Fetch all notices for a tenant
const getNoticesByTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const notices = await Notice.find({ tenantId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Mark Notice as Read
const markAsRead = async (req, res) => {
    try {
        const { noticeId, userEmail } = req.body;
        const notice = await Notice.findByIdAndUpdate(
            noticeId,
            { $addToSet: { readBy: userEmail } }, // $addToSet prevent duplicates
            { new: true }
        );
        res.status(200).json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    broadcastNotice,
    getNoticesByTenant,
    markAsRead
};