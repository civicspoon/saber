"use client";

import { useEffect, useRef } from "react";
import AirlineSelect from "../Flight/Components/AirlineSelect";

function Page() {
    const selectRef = useRef(null);

    useEffect(() => {
        function setSelectOptionByValue() {
            if (selectRef.current) {
                selectRef.current.value = 4;
            }
        }
        setSelectOptionByValue();
    }, []);

    return (
        <div>
            <AirlineSelect ref={selectRef} />
        </div>
    );
}

export default Page;
