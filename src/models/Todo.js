import mongoose from "mongoose";

const SubtaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 120 },
        done: { type: Boolean, default: false },
    },
    { _id: true }
);

const TodoSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

        title: { type: String, required: true, trim: true, maxlength: 160 },
        description: { type: String, default: "" },

        status: { type: String, enum: ["todo", "doing", "done"], default: "todo", index: true },
        priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium", index: true },

        tags: { type: [String], default: [] },

        dueAt: { type: Date, default: null, index: true },
        reminderAt: { type: Date, default: null, index: true },

        subtasks: { type: [SubtaskSchema], default: [] },

        // for drag reorder
        orderIndex: { type: Number, default: 0, index: true },

        completedAt: { type: Date, default: null },
        archived: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);