import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Define the type for dropdown options
type OptionType = { value: string; label: string };

const TeamDropdown = () => {
  // State to store the selected team option
  const [selectedTeam, setSelectedTeam] = useState<OptionType | null>(null);

  // Options available in the dropdown menu
  const options: OptionType[] = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'communications', label: 'Communications' },
    { value: 'projects', label: 'Projects' },
  ];

  // Function to handle the dropdown option selection
  const handleChange = (team: OptionType) => {
    setSelectedTeam(team);
    if (team) {
      // Show the corresponding team section based on the selected option
      showTeamSectionMobile(team.value);
    }
  };

  // Function to display the selected team section and hide others
  const showTeamSectionMobile = (team: string) => {
    // Hide all sections initially
    document.querySelectorAll('.team-section').forEach((section) => {
      (section as HTMLElement).style.display = 'none';
    });

    // Display the section that corresponds to the selected team
    const teamSection = document.getElementById(`${team}-section`);
    if (teamSection) {
      teamSection.style.display = 'block';
    }
  };

  // Function to show all team sections (used for desktop view)
  const showAllSections = () => {
    document.querySelectorAll('.team-section').forEach((section) => {
      (section as HTMLElement).style.display = 'block'; // Show all sections on desktop
    });
  };

  // Use an effect to handle screen resize events
  useEffect(() => {
    // Handle screen resizing to display or hide sections depending on screen size
    const handleResize = () => {
      if (window.innerWidth > 800) {
        // Show all sections on larger screens (desktop view)
        showAllSections();
      } else {
        // Hide all sections on smaller screens (mobile view)
        document.querySelectorAll('.team-section').forEach((section) => {
          (section as HTMLElement).style.display = 'none';
        });
      }
    };

    // Add the resize event listener
    window.addEventListener('resize', handleResize);

    // Initial check when the component is mounted
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="dropdown-mobile-only">
      {/* Dropdown menu for mobile view */}
      <Menu as="div" className="menu-container">
        <div>
          {/* Dropdown button to select a team */}
          <MenuButton className="menu-button">
            {selectedTeam ? selectedTeam.label : "Select a team"}
            <ChevronDownIcon className="menu-icon" />
          </MenuButton>
        </div>

        {/* Dropdown items containing team options */}
        <MenuItems className="menu-items">
          <div className="menu-item-wrapper">
            {/* Map over the options array to generate dropdown items */}
            {options.map((option) => (
              <MenuItem
                key={option.value}
                as="button"
                onClick={() => handleChange(option)} // Handle team selection
                className="menu-item"
              >
                {option.label} {/* Display the label of each option */}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default TeamDropdown;
