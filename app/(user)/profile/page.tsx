import { getUser } from "@/app/lib/auth";
import ProfileClient from "@/app/components/profile/ProfileClient";

export default async function Page() {

    const user = await getUser();

    return (
        <div className="h-full">
            <ProfileClient user={JSON.parse(JSON.stringify(user))} />
        </div>
    );
}