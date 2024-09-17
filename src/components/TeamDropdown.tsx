import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

type OptionType = { value: string; label: string };

const TeamDropdown = () => {
  const [selectedTeam, setSelectedTeam] = useState<OptionType | null>(null);

  const options: OptionType[] = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'communications', label: 'Communications' },
    { value: 'projects', label: 'Projects' },
  ];

  const handleChange = (team: OptionType) => {
    setSelectedTeam(team);
    if (team) {
      showTeamSection(team.value);
    }
  };

  const showTeamSection = (team: string) => {
    document.querySelectorAll('.team-section').forEach((section) => {
      (section as HTMLElement).style.display = 'none'; // Hide all sections
    });
    const teamSection = document.getElementById(`${team}-section`);
    if (teamSection) {
      teamSection.style.display = 'block'; // Show the selected team section
    }
  };

  const showAllSections = () => {
    document.querySelectorAll('.team-section').forEach((section) => {
      (section as HTMLElement).style.display = 'block'; // Show all sections on desktop
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        showAllSections(); // On desktop, ensure all sections are visible
      } else {
        document.querySelectorAll('.team-section').forEach((section) => {
          (section as HTMLElement).style.display = 'none'; // Initially hide all sections on mobile
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check on component mount
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="dropdown-mobile-only">
      <Menu as="div" className="menu-container">
        <div>
          <MenuButton className="menu-button">
            {selectedTeam ? selectedTeam.label : "Select a team"}
            <ChevronDownIcon className="menu-icon" />
          </MenuButton>
        </div>

        <MenuItems className="menu-items">
          <div className="menu-item-wrapper">
            {options.map((option) => (
              <MenuItem
                key={option.value}
                as="button"
                onClick={() => handleChange(option)}
                className="menu-item"
              >
                {option.label}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default TeamDropdown;
