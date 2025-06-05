import { Controller } from "react-hook-form";
import Select from "react-select";
import '../css/DropDown.css';

function DropDown({ label, options, fieldname, formcontrol, error, required, storeLabel = false, sorted = true }) {
    let sorted_options = options ? Object.entries(options) : [];
    if (sorted) {
        sorted_options.sort((a, b) => a[1].localeCompare(b[1]));
    }

    const selectOptions = sorted_options.map(([key, val]) => ({
        value: key,
        label: val
    }));

    return (
        <div className='dropDown'>
            <div className='dropdown-label'>
                {label} {required && <span className='required'>*</span>}
            </div>
            <Controller
                name={fieldname}
                control={formcontrol}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={selectOptions}
                        value={selectOptions.find(option =>
                            storeLabel ? option.label == field.value : option.value == field.value
                        ) || null}
                        onChange={option => field.onChange(option ? (storeLabel ? option.label : option.value) : "")}
                        className="dropdown"
                        classNamePrefix="dropdown"
                        isSearchable
                        isClearable={false}
                        placeholder="Select"
                        getOptionLabel={(option) => `${option.label}`}
                    />
                )}
            />
            {error && <div className="dropdown-error">{error}</div>}
        </div>
    );
}

export default DropDown;