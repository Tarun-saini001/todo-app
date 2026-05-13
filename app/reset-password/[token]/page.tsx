import ResetPasswordForm from
"@/app/components/auth/ResetPasswordForm";

export default async function Page({
    params,
}: {
    params: Promise<{ token: string }>
}) {

    const { token } = await params;

    return (
        <>
        
                <div className="w-1/2 h-[70vh] flex flex-col justify-center px-10">
                <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
                        <ResetPasswordForm token={token} />
                </div>
        
        
                <div className="w-1/2 flex h-[70vh] items-center justify-center">
                    <img
                        src="/images/login.png"
                        alt="login illustration"
                        className="w-full h-[60vh] object-contain"
                    />
                </div>
        
            </>
        
        
    );
}