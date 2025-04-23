import React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";

interface DropdownProps {
    options: IDropdownOption[];
    onChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
    multiSelect?: boolean; 
}

export const CountryDropdown: React.FC<DropdownProps> = ({ options, onChange, multiSelect = true, ...props}) => (
    <Dropdown
        multiSelect={multiSelect}
        placeholder="Select a country"
        label="Filter by country"
        options={options}
        onChange={onChange}
        {...props}
        
    />
);
