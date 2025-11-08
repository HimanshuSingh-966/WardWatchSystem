import AdminHeader from '../AdminHeader';

export default function AdminHeaderExample() {
  return (
    <AdminHeader 
      notificationCount={5}
      adminName="Dr. Sarah Chen"
      onNotificationClick={() => console.log('Notifications clicked')}
    />
  );
}
