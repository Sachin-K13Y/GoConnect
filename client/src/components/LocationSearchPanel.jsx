import React from 'react';
import 'remixicon/fonts/remixicon.css';

const LocationSearchPanel = ({ suggestions = [], onSuggestionClick }) => {

    if (suggestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full text-gray-400">
                <i className="ri-search-eye-line text-5xl mb-3"></i>
                <h3 className="font-semibold text-gray-600">No locations found</h3>
                <p className="text-sm">Try searching for a different place.</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <ul className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                    <li
                        key={suggestion.place_id || idx}
                        onClick={() => onSuggestionClick(suggestion.description)}
                        className="flex items-center gap-4 p-4 rounded-xl cursor-pointer
                                   hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                            <i className="ri-map-pin-line text-gray-600"></i>
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-gray-800">
                                {suggestion.structured_formatting?.main_text || suggestion.description.split(',')[0]}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {suggestion.structured_formatting?.secondary_text || suggestion.description.substring(suggestion.description.indexOf(',') + 1)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LocationSearchPanel;
