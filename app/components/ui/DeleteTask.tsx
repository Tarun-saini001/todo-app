"use client";

export default function DeleteConfirmModal({
    open,
    onClose,
    onConfirm,
    loading,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[350px] text-center shadow-lg">

                <h2 className="text-lg font-semibold mb-2">
                    Delete Task
                </h2>

                <p className="text-gray-500 text-sm mb-6">
                    Are you sure you want to delete this task?
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border cursor-pointer rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-[#FF6767] cursor-pointer text-white rounded-md"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}