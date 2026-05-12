import ResetPasswordForm from
"@/app/components/auth/ResetPasswordForm";

export default async function Page({
    params,
}: {
    params: Promise<{ token: string }>
}) {

    const { token } = await params;

    return (
        <div className="w-full h-[70vh] flex items-center justify-center">
            <ResetPasswordForm token={token} />
        </div>
    );
}