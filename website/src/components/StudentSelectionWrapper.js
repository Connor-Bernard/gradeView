import { createContext, useState } from "react";

export const StudentSelectionContext = createContext({
    selectedStudent: "",
    setSelectedStudent: () => {}
});

export default function StudentSelectionWrapper({ children }) {
    const [selectedStudent, setSelectedStudent] = useState("");
    const value = { selectedStudent: selectedStudent, setSelectedStudent: setSelectedStudent };

    return (
        <StudentSelectionContext.Provider value={value}>
            {children}
        </StudentSelectionContext.Provider>
    )

}