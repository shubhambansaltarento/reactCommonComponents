/**
 * @component Unauthorized
 * Displays a message when the user does not have permission to view the page.
 */
export default function Unauthorized() {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>You do not have permission to view this page.</p>
        </div>
    );
}