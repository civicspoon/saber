// app/user/layout.js

export default function UserLayout({ children }) {
    return (
        <html lang="en">
            <body >
                {children}
            </body>
        </html>
    );
}