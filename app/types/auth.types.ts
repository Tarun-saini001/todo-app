export type LoginState = {
    success: boolean;
    message: string;
    errors?: {
        userName?: string[];
        password?: string[];
    };
};

export type RegisterState = {
    success: boolean;
    errors: {
        firstName?: string[];
        lastName?: string[];
        userName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message: string;
};