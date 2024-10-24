import ChangPassword from "@/app/Components/ChangPassword";

function page() {
    return (
        <div className="flex-1  ">
            <div className="flex justify-center items-center p-5 rounded-lg bg-slate-200 ">
                <ChangPassword />
            </div>
        </div>
    );
}

export default page;