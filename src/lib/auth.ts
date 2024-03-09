"use server"
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth.config";
import { getOnboardingDetails } from "./data/user.data";


export const getAuthSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
    const session = await getAuthSession();
    return session?.user;
}
export const getActorUser = async (user: Session["user"] | undefined) => {
    if (!user) return undefined
    return user?.actor
}

export const getCurrentRole = async () => {
    const session = await getAuthSession();
    return session?.user?.role;
};

export const getCurrentIsOnboarded = async () => {
    const session = await getAuthSession();
    const onboarding = await getOnboardingDetails(session?.user.id)
    return onboarding;
};
