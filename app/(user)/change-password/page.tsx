import { getUser } from "@/app/lib/auth";
import ChangePasswordClient
    from "@/app/components/profile/ChangePasswordClient";

export default async function Page() {

    const user = await getUser();

    return (
        <div className="h-full ">
            <ChangePasswordClient
                user={JSON.parse(JSON.stringify(user))}
            />
        </div>
    );
}