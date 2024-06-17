import Menu from "./components/Menu";

export default function AirlineLayout({ children }) {
    return (
        <div className="">
            <Menu />
            <div>
                {children}
            </div>
        </div>
    );
}
