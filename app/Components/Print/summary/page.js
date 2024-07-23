// page.js
import React, { Suspense } from 'react';
import ClientComponent from './ClientComponent';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientComponent />
        </Suspense>
    );
}
