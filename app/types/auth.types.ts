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

export type ForgotPasswordState = {
    success: boolean;
    message: string;
    errors?: {
        email?: string[];
    };
};

export type ResetPasswordState = {
    success: boolean;
    message: string;
    errors?: {
        password?: string[];
        confirmPassword?: string[];
    };
};