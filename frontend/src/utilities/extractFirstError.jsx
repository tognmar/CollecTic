export const extractFirstError = (errorData) => {

        if (!errorData) return {file: ["An unknown error occurred."]};

        // String case
        if (typeof errorData === 'string') {
            return {file: [errorData]};
        }

        // JSON object
        if (typeof errorData === 'object') {
            // Common DRF top-level error fields
            if (typeof errorData.error === 'string') {
                return {file: [errorData.error]};
            }
            if (typeof errorData.detail === 'string') {
                return {file: [errorData.detail]};
            }

            // Field-specific errors
            for (const key in errorData) {
                const value = errorData[key];
                if (Array.isArray(value)) {
                    return {[key]: value};
                }
                if (typeof value === 'string') {
                    return {[key]: [value]};
                }
            }
        }

        // Fallback
        return {file: ["An unknown error occurred."]};
    };