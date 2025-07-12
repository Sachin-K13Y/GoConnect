import React from 'react';

const LocationSearchPanel = (props) => {
    const {
        suggestions = [],
        onSuggestionClick,
        setVehiclePanel,
        setPanelOpen,
    } = props;

    return (
        <div>
            {suggestions.length > 0 ? (
                suggestions.map((elem, idx) => (
                    <div
                        key={idx}
                        onClick={() => {
                            onSuggestionClick(elem.description);
                        }}
                        className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
                    >
                        <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
                            <i className="ri-map-pin-fill"></i>
                        </h2>
                        <h4 className="font-medium">{elem.description}</h4>
                    </div>
                ))
            ) : (
                [
                
                ].map((elem, idx) => (
                    <div
                        key={idx}
                        onClick={() => {
                            // setVehiclePanel(true);
                            // setPanelOpen(false);
                        }}
                        className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
                    >
                        <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
                            <i className="ri-map-pin-fill"></i>
                        </h2>
                        <h4 className="font-medium">{elem}</h4>
                    </div>
                ))
            )}
        </div>
    );
};

export default LocationSearchPanel;
