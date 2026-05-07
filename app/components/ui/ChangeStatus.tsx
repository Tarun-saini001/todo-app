"use client";

export default function ChangeStatus({
    open,
    onClose,
    onConfirm,
    message,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[300px] text-center">
                <p className="mb-4 text-gray-700">{message}</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 cursor-pointer border rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-1 bg-[#FF6767] cursor-pointer text-white rounded"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}