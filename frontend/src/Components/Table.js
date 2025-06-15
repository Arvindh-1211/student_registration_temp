import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

import '../css/Table.css'

function Table({ tableData = [], title, onRowClick, onCreateNew = null }) {
    const fields = tableData && tableData.length > 0 ? Object.keys(tableData[0]) : []

    const [filteredData, setFilteredData] = useState(tableData)
    const [filteredFields, setFilteredFields] = useState(fields)

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState([])

    // Ref for the filter container to detect clicks outside
    const filterContainerRef = useRef(null);

    const [page, setPage] = useState(0);
    const numberOfItemsPerPageList = [5, 10, 20]
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const from = page * itemsPerPage;
    const to = filteredData && filteredData.length > 0 ? Math.min((page + 1) * itemsPerPage, filteredData.length) : null;

    useEffect(() => {
        setFilteredData(tableData);
        if (selectedFilters.length === 0) {
            setFilteredFields(fields)
        }
    }, [tableData])

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage])

    // Add this effect to handle clicks outside the filter menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                setIsFilterMenuOpen(false);
            }
        }

        // Add event listener only when filter menu is open
        if (isFilterMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterMenuOpen]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase()
        const filtered = tableData.filter((row) => {
            return filteredFields.some((field) => {
                const value = row[field];
                return value !== null && value !== undefined && value.toString().toLowerCase().includes(searchTerm)
            })
        })
        setFilteredData(filtered)
    }
    const handleFilterChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedFilters([...selectedFilters, value]); // Add field to selectedFilters if checked
        } else {
            setSelectedFilters(selectedFilters.filter((field) => field !== value)); // Remove field if unchecked
        }
    };
    useEffect(() => {
        if (selectedFilters.length > 0) {
            setFilteredFields(selectedFilters)
        } else {
            setFilteredFields(fields)
        }
    }, [selectedFilters])

    return (
        <div className='table-container'>
            <div className='table-header'>
                <div className='table-title'>{title}</div>
                <div className='table-search'>
                    {/* Search */}
                    <input type='text' placeholder='Search...' className='search-input' onChange={handleSearch} />

                    {/* Filter coloumns */}
                    <div className='filter-container' ref={filterContainerRef}>
                        <FaFilter className='filter-icon' onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} />
                        {isFilterMenuOpen && (
                            <div className='filter-menu'>
                                <div className='filter-menu-header'>Filter</div>
                                <div className='filter-menu-body'>
                                    {fields && fields.map((field, index) => (
                                        <div key={index} className='filter-option'>
                                            <input type='checkbox' id={field} name={field} value={field} checked={selectedFilters.includes(field)} onChange={handleFilterChange} />
                                            <label htmlFor={field}>{field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {onCreateNew &&
                        <button onClick={onCreateNew} className='add-button' >
                            <GoPlus className="header-dropdown-menu-icon" />
                            Add
                        </button>
                    }
                </div>
            </div>

            {/* Table */}
            <div className='table-wrapper'>
                <table className='table'>
                    <thead>
                        <tr>
                            {filteredFields && filteredFields.map((field, index) => (
                                <th key={index}>{field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData && filteredData.length > 0 ? filteredData.slice(from, to).map((row, index) => (
                            <tr key={index} onClick={() => onRowClick ? onRowClick(row) : null}>
                                {filteredFields.map((field, index) => (
                                    <td key={index}>{row[field]}</td>
                                ))}
                            </tr>
                        )) : (
                            <tr><td colSpan={filteredFields?.length || 1}>No data available</td></tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className='table-pagination'>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <div className='items-per-page'>
                    <span>Per page </span>
                    <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(e.target.value)}>
                        {numberOfItemsPerPageList.map((numberOfItemsPerPage, index) => (
                            <option key={index} value={numberOfItemsPerPage}>{numberOfItemsPerPage}</option>
                        ))}
                    </select>
                </div>
                <button disabled={to >= (filteredData && filteredData.length)} onClick={() => setPage(page + 1)}>Next</button>
            </div>
            <div className='table-footer'>
                <span>
                    {filteredData.length === 0
                        ? "No results"
                        : `Showing ${from + 1} to ${to} of ${filteredData.length} results`}
                </span>
            </div>
        </div>
    )
}

export default Table
