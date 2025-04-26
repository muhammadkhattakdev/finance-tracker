import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import Request from '../../../utils/request';
import { format } from 'date-fns';
import './style.css';

// Icons
const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 6L12 3L19 6" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10V21" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 10V21" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14V17" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14V17" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 14V17" className="bank-icon-path" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.667 3.333L13.333 6.667M13.333 6.667H17.5M13.333 6.667V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.333 16.667L6.667 13.333M6.667 13.333H2.5M6.667 13.333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 9.167C17.5 13.771 13.771 17.5 9.167 17.5C4.562 17.5 0.833 13.771 0.833 9.167C0.833 4.562 4.562 0.833 9.167 0.833C9.899 0.833 10.612 0.944 11.29 1.152" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BankLogo = ({ bank }) => {
  const initials = bank?.institution_name?.split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'BA';

  return (
    <div className="bank-logo">
      {initials}
    </div>
  );
};

const BankConnection = ({ onConnect }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getLinkToken = async () => {
      setIsLoading(true);
      try {
        const response = await Request.post('/plaid/create_link_token/');
        setLinkToken(response.data.link_token);
        setError(null);
      } catch (err) {
        console.error('Error creating link token:', err);
        setError('Failed to initialize bank connection. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        setIsLoading(true);
        await Request.post('/plaid/exchange_public_token/', {
          public_token: public_token,
          institution_id: metadata.institution.institution_id,
          institution_name: metadata.institution.name,
          accounts: metadata.accounts
        });
        setError(null);
        if (onConnect) onConnect();
      } catch (err) {
        console.error('Error exchanging public token:', err);
        setError('Failed to connect bank account. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onExit: (err, metadata) => {
      if (err != null) {
        console.error('Plaid Link exit error:', err, metadata);
      }
    },
  });

  return (
    <div className="connect-bank-card">
      <div className="connect-bank-card-header">
        <BankIcon />
        <h3>Connect Your Bank</h3>
      </div>
      
      <div className="connect-bank-card-content">
        <p>
          Securely connect your bank accounts to automatically import transactions.
          All your financial data in one place - safe, secure, and private.
        </p>
        
        {error && (
          <div className="connect-bank-error">
            {error}
          </div>
        )}
        
        <div className="connect-bank-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <div className="benefit-text">
              <h4>Track Automatically</h4>
              <p>Your transactions are imported automatically, so your dashboard is always up to date.</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">🔒</div>
            <div className="benefit-text">
              <h4>Bank-Level Security</h4>
              <p>Your credentials are never stored. We use Plaid, trusted by millions of users.</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <div className="benefit-text">
              <h4>Save Time</h4>
              <p>No more manual entry. Focus on analyzing your spending habits instead.</p>
            </div>
          </div>
        </div>
        
        <button 
          className="connect-bank-button" 
          onClick={() => open()}
          disabled={!ready || !linkToken || isLoading}
        >
          {isLoading ? (
            <>
              <div className="button-spinner"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <PlusIcon />
              <span>Connect Bank Account</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const AccountCard = ({ account, onSync }) => {
  const getBalanceText = () => {
    if (account.balance_available != null) {
      return `Available: $${parseFloat(account.balance_available).toFixed(2)}`;
    } else if (account.balance_current != null) {
      return `Current: $${parseFloat(account.balance_current).toFixed(2)}`;
    }
    return 'Balance unavailable';
  };
  
  return (
    <div className="account-card">
      <div className="account-card-header">
        <div className="account-info">
          <h4>{account.name}</h4>
          <div className="account-meta">
            <span className="account-type">{account.subtype || account.type}</span>
            {account.mask && <span className="account-mask">•••• {account.mask}</span>}
          </div>
        </div>
        <div className="account-balance">
          {getBalanceText()}
        </div>
      </div>
      
      <div className="account-card-footer">
        <button 
          className="sync-button"
          onClick={onSync}
          title="Manually sync transactions"
        >
          <RefreshIcon />
          <span>Sync Now</span>
        </button>
        <button className="details-button">
          <span>View Transactions</span>
          <ChevronIcon />
        </button>
      </div>
    </div>
  );
};

const BankCard = ({ bank, onSync }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const lastUpdated = new Date(bank.last_updated);
  const formattedDate = format(lastUpdated, "MMM d, yyyy 'at' h:mm a");
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`bank-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="bank-card-header" onClick={toggleExpanded}>
        <div className="bank-info">
          <BankLogo bank={bank} />
          <div>
            <h3>{bank.institution_name}</h3>
            <p className="bank-meta">Last updated: {formattedDate}</p>
          </div>
        </div>
        <div className="expand-icon">
          <ChevronIcon />
        </div>
      </div>
      
      {isExpanded && (
        <div className="bank-card-content">
          <div className="accounts-list">
            {bank.accounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account} 
                onSync={() => onSync(bank.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BankConnectionPage = () => {
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncingBank, setSyncingBank] = useState(null);

  const fetchBanks = async () => {
    setIsLoading(true);
    try {
      const response = await Request.get('/plaid/items/');
      setBanks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bank connections:', err);
      setError('Failed to load bank connections. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleSync = async (bankId) => {
    setSyncingBank(bankId);
    try {
      await Request.post('/plaid/sync_transactions/');
      await fetchBanks();
      // Show success notification
    } catch (err) {
      console.error('Error syncing transactions:', err);
      // Show error notification
    } finally {
      setSyncingBank(null);
    }
  };

  return (
    <div className="bank-connection-page">
      <div className="bank-connection-header">
        <div className="bank-connection-title">
          <BankIcon />
          <h2>Bank Connections</h2>
        </div>
        <p className="bank-connection-subtitle">
          Connect your bank accounts to automatically import transactions
        </p>
      </div>

      {error && (
        <div className="bank-connection-error">
          {error}
        </div>
      )}

      <div className="bank-connection-content">
        {isLoading && banks.length === 0 ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your bank connections...</p>
          </div>
        ) : (
          <>
            {banks.length > 0 ? (
              <div className="banks-list">
                {banks.map(bank => (
                  <BankCard 
                    key={bank.id} 
                    bank={bank} 
                    onSync={handleSync}
                    syncing={syncingBank === bank.id}
                  />
                ))}
              </div>
            ) : null}

            <BankConnection onConnect={fetchBanks} />
          </>
        )}
      </div>
    </div>
  );
};

export default BankConnectionPage;