
export const createDeviceMarkerElement = (): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'device-marker';
  markerElement.style.cssText = `
    width: 32px;
    height: 32px;
    background-color: #43A3FA;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  markerElement.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return markerElement;
};

export const createUserMarkerElement = (): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'user-marker';
  markerElement.style.cssText = `
    width: 32px;
    height: 32px;
    background-color: #10B981;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  markerElement.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.5 3.5 14 3.9 14 4.4V6H10V4.4C10 3.9 9.5 3.5 9 3.5L3 7V9H1V11H3V17C3 18.1 3.9 19 5 19H9V12H11V19H15C16.1 19 17 18.1 17 17V11H19V9H21Z"/>
    </svg>
  `;

  return markerElement;
};

export const createDevicePopupContent = (device: { nickname?: string; batteryLevel: number; lastUpdate: string }): string => {
  return `
    <div class="p-2">
      <h3 class="font-semibold text-gray-900">${device.nickname || 'Ouderen Alarm'}</h3>
      <p class="text-sm text-gray-600">Batterij: ${device.batteryLevel}%</p>
      <p class="text-xs text-gray-500">
        Laatste update: ${new Date(device.lastUpdate).toLocaleTimeString('nl-NL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </p>
    </div>
  `;
};

export const createUserPopupContent = (accuracy?: number, timestamp?: number): string => {
  return `
    <div class="p-2">
      <h3 class="font-semibold text-gray-900">Jouw locatie</h3>
      <p class="text-sm text-gray-600">Nauwkeurigheid: ${accuracy ? Math.round(accuracy) + 'm' : 'Onbekend'}</p>
      <p class="text-xs text-gray-500">
        Bijgewerkt: ${timestamp ? new Date(timestamp).toLocaleTimeString('nl-NL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : 'Onbekend'}
      </p>
    </div>
  `;
};
