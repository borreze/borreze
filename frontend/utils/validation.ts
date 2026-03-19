export function parseValidationErrors(data: any): { title: string, message: string } {
    const title = data.message || "Erreur";

    if (!data.errors || !Array.isArray(data.errors)) {
        return {
            title,
            message: "Une erreur inconnue est survenue"
        };
    }

    const message = data.errors
        .map((err: any) => err.message)
        .join("\n");

    return {
        title,
        message
    };
}