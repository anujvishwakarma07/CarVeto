import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, User as UserIcon, Calendar, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

const SettingsView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch user profile.');
        }

        setProfile(data);
      } catch (err) {
        console.error('Error fetching settings profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPassSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Change password error:', err);
      setPassError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flag-item">
        <AlertCircle size={20} />
        <span>Error loading settings: {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="view-header">
        <h1 className="view-title">Account & Settings</h1>
        <p className="view-subtitle">Manage your personal credentials, check usage statistics, and update preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Profile Card */}
        {profile && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserIcon size={20} style={{ color: 'var(--primary)' }} />
              Profile Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <UserIcon size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</p>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{profile.user.username}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</p>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{profile.user.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</p>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{new Date(profile.user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <BarChart3 size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contracts Audited</p>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{profile.stats.contractAudited || 0} Documents</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} style={{ color: 'var(--primary)' }} />
            Update Security
          </h3>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                Current Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password..."
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={updating}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                New Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password (min. 6 chars)..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={updating}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={updating}
              />
            </div>

            {passError && (
              <div className="flag-item" style={{ marginTop: '8px' }}>
                <AlertCircle size={18} />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '13px' }}>
                <CheckCircle size={18} />
                <span>{passSuccess}</span>
              </div>
            )}

            <button type="submit" className="btn" style={{ marginTop: '10px', justifyContent: 'center' }} disabled={updating}>
              {updating ? <><div className="spinner"></div> Saving...</> : 'Save Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
