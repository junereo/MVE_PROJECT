//use client
import { useHomeStore } from "../../../store/globalStore"; // ✅ 여기서는 create 안 씀

const TabMenu = () => {
    const activeTab = useHomeStore((state) => state.activeTab);
    const setActiveTab = useHomeStore((state) => state.setActiveTab);

    return (
        <button onClick={() => setActiveTab("trending")}> {activeTab} </button>
    );
};

export default TabMenu;
