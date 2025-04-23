import React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";

interface DropdownProps {
    options: IDropdownOption[];
    onChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
    multiSelect?: boolean; 
}

export const RegionDropdown: React.FC<DropdownProps> = ({ options, onChange, multiSelect = true, ...props}) => (
    <Dropdown
        multiSelect={multiSelect}
        placeholder="Select a region"
        label="Filter by region"
        options={options}
        onChange={onChange}
        {...props}
    />
);
