'use client';
import { useState } from 'react';
import Dropdown from "@/app/components/ui/DropDown";

const ExamplePage = () => {
    const [selectedType, setSelectedType] = useState('객관식');

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">질문 유형 선택</h2>
            <Dropdown
                options={['객관식', '서술형']}
                selected={selectedType}
                onSelect={setSelectedType}
            />

            <p className="mt-4">
                선택된 유형: <strong>{selectedType}</strong>
            </p>
        </div>
    );
};

export default ExamplePage;
