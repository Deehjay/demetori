import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

// Define a unique type for drag-and-drop items
const ItemType = "MEMBER";

// Function to determine the emoji based on weapons
const getEmojiForWeapons = (weapons) => {
  const shieldCombos = ["SNS/GS", "SNS/WAND", "SNS/DAGGER"];
  const sleepCombos = ["DAGGER/WAND"];
  const swordCombos = [
    "XBOW/DAGGER",
    "BOW/DAGGER",
    "STAFF/DAGGER",
    "BOW/STAFF",
    "GS/DAGGER",
    "GS/STAFF",
    "BOW/XBOW",
  ];
  const supportCombos = ["BOW/WAND", "STAFF/WAND"];

  if (shieldCombos.includes(weapons)) return "🛡️";
  if (sleepCombos.includes(weapons)) return "💤";
  if (swordCombos.includes(weapons)) return "⚔️";
  if (supportCombos.includes(weapons)) return "💚";

  return "❔"; // Default emoji if no match
};

// Component for each group
const Group = ({ name, members, onDrop }) => {
  const [, dropRef] = useDrop({
    accept: ItemType,
    drop: (item) => onDrop(item.id, name), // Pass member ID and new group name
  });

  // Sort members by their emoji
  const sortedMembers = [...members].sort((a, b) => {
    const emojiOrder = ["🛡️", "💚", "⚔️", "💤", "❔"];
    const emojiA = getEmojiForWeapons(a.weapons);
    const emojiB = getEmojiForWeapons(b.weapons);
    return emojiOrder.indexOf(emojiA) - emojiOrder.indexOf(emojiB);
  });

  return (
    <div
      ref={dropRef}
      className="p-4 bg-neutral rounded-md shadow-md w-64 min-h-[150px] h-[350px] flex flex-col">
      <h3 className="font-bold text-xl text-primary mb-2">{name}</h3>
      <div className="overflow-auto flex-grow">
        {sortedMembers.map((member) => (
          <DraggableMember
            key={member.memberId} // Use a unique identifier
            id={member.memberId}
            name={member.inGameName} // Display in-game name
            weapons={member.weapons} // Pass weapons to get emoji
          />
        ))}
      </div>
    </div>
  );
};

// Draggable member component
const DraggableMember = ({ id, name, weapons }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { id }, // Pass only the member's ID
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const emoji = getEmojiForWeapons(weapons);

  return (
    <div
      ref={dragRef}
      className={`p-2 m-1 bg-base-100 font-bold rounded shadow cursor-move flex justify-between items-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}>
      <span>
        {emoji} {name}
      </span>
      <span className="text-[10px] text-gray-500">{weapons}</span>
    </div>
  );
};

// Main groups page
const GroupsPage = () => {
  const [members, setMembers] = useState([]);
  const [groups] = useState([
    "Flex",
    "Group 1",
    "Group 2",
    "Group 3",
    "Group 4",
    "Group 5",
    "Group 6",
    "Group 7",
    "Group 8",
    "BOMBA",
    "Fill",
    "Fill 2",
  ]);

  useEffect(() => {
    // Fetch members from the database with token
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/members`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token in the headers
          }
        );

        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, []);

  const handleDrop = async (memberId, groupName) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      console.log(`Member ID: ${memberId}, New Group: ${groupName}`);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/members/update-member-group`,
        {
          memberId,
          groupName,
        },
        { headers: { Authorization: `Bearer ${token}` } } // Pass token in headers
      );

      // Update the UI
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.memberId === memberId
            ? { ...member, group: groupName }
            : member
        )
      );
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen justify-center gap-12 items-center">
        <div>
          <h1 className="text-3xl font-bold">Demetori Group Planner</h1>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 w-10/12">
          {/* Render Groups */}
          {groups.map((groupName) => (
            <Group
              key={groupName}
              name={groupName}
              members={members.filter((member) => member.group === groupName)}
              onDrop={handleDrop}
            />
          ))}
          {/* Ungrouped Members Section */}
          <Group
            name="Ungrouped"
            members={members.filter((member) => member.group === "Ungrouped")}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default GroupsPage;
