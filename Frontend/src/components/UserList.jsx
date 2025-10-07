const UserList = ({ users, onSelectUser, selectedUser, unreadMessages, onlineUsers }) => {

  return (

    <div className="overflow-y-auto">

      <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2 p-2">
  Users
</h2>


      <ul className="space-y-1">

        {users.map((user) => {

          const isOnline = onlineUsers.includes(user._id);

           const hasUnread = unreadMessages[user._id] > 0;

          return (

            <li
  key={user._id}
  onClick={() => onSelectUser(user)}
  className={`flex items-center p-2 rounded-md cursor-pointer 
    text-[rgb(var(--list-text))] 
    ${selectedUser?._id === user._id 
      ? 'bg-gradient-to-r from-[rgb(var(--send-btn-from))] to-[rgb(var(--send-btn-to))] text-[rgb(var(--send-btn-text))]'
      : 'hover:bg-[rgb(var(--list-hover))]'
    }`}
>

              <div className="relative mr-3">

                <img

                  src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user.name}`}

                  alt="avatar"

                  className="w-10 h-10 rounded-full flex-shrink-0"

                />

                {isOnline && (

                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>

                )}

              </div>

              <span className={`truncate ${hasUnread ? 'font-bold' : ''}`}>
                            {user.name}
                        </span>

            </li>

          );

        })}

      </ul>

    </div>

  );

};



export default UserList;