import Parse from "parse";
import { useState, useEffect } from "react";
import Header from "../components/Header";

const BlockedPage = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    loadBlockedData();
  });

  const loadBlockedData = async () => {
    try {
      const currentUser = await Parse.User.currentAsync();
      const listOfBlockedUsers = new Parse.Query('Block');
      listOfBlockedUsers.equalTo('blockingUser', currentUser);
      listOfBlockedUsers.include('blockingUser', 'blockedUser');

      const blockedUsersArray = await listOfBlockedUsers.find();
      setBlockedUsers(blockedUsersArray);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  };

  const unblockUser = async (blockedUser) => {
    try {
      // Remove the block entry from Parse
      const blockQuery = new Parse.Query('Block');
      blockQuery.equalTo('blockingUser', Parse.User.current());
      blockQuery.equalTo('blockedUser', blockedUser);
      const blockEntry = await blockQuery.first();
      if (blockEntry) {
        await blockEntry.destroy();
        console.log('user unblocked')
        // Reload the blocked users after unblocking
        loadBlockedData();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  return (
    <div className='page-body'>
      <Header type='withBackButton' pageTitle='Blocked Contacts' />
      <div className='container'>
        <div className="blocked-list">
          {blockedUsers.length === 0 ? (
            <p className="no-blocked">You have no blocked contacts 😉</p>
          ) : (
            blockedUsers.map((user) => (
              <div key={user.id} className="blocked-element">
                <div className="blocked-flex">
                  <div className="profile-pic">{user.get('blockedUser').get('fullName')[0]}</div>
                  <div>{user.get('blockedUser').get('fullName')}</div>
                </div>
                <button className='tertiary-button' onClick={() => unblockUser(user.get('blockedUser'))}>
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

};

export default BlockedPage;
