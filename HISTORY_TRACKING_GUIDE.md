# Ward Watch - Treatment History Tracking Guide

## Overview

Treatment History is Ward Watch's audit trail system that logs completed treatments for each patient. When staff members mark medications, procedures, or investigations as complete, a permanent record is created in the system.

## What is Treatment History?

Treatment History captures records of completed treatments, including:

### Medications
- Medication name and dosage
- Scheduled time vs. actual completion time
- Which staff member administered it
- Any notes about the administration

### Procedures
- Procedure name and type
- Scheduled time vs. completion time
- Performing staff member
- Procedure notes

### Investigations
- Investigation/test name
- When it was ordered vs. when completed
- Who performed or ordered it
- Results or notes

---

## Accessing Treatment History

### Via Treatment History Page

1. **Navigate directly**: Go to `/admin/treatment-history` in your browser
2. **Select a Patient**: Choose a patient from the dropdown menu
3. **Review Timeline**: See all completed treatments in reverse chronological order (newest first)

### What You'll See

Each history entry displays:
- **Type**: Badge showing Medication, Procedure, or Investigation
- **Treatment Name**: What was performed
- **Scheduled Time**: When it was originally planned
- **Completed Time**: When it was actually done
- **Timing**: Visual indicator showing if treatment was on-time, early, or late
  - ✓ Green checkmark: Completed within 15 minutes of scheduled time
  - 🟠 Orange alert: Completed more than 15 minutes late
  - 🔵 Blue clock: Completed more than 15 minutes early
- **Completed By**: Staff member ID who performed it
- **Notes**: Any additional observations (or "No notes" if none provided)

---

## How Treatment History is Created

Treatment history records are created automatically by the system when staff complete treatments:

### When You Mark a Treatment Complete

1. Staff member logs into Ward Watch
2. Navigates to their treatment timeline or patient view
3. Marks a medication, procedure, or investigation as complete
4. Optionally adds notes about the treatment
5. System automatically creates a history record with:
   - Timestamp of completion
   - Staff member who completed it
   - Original scheduled time
   - Any notes provided

### Database Storage

All treatment history is stored in the Supabase `treatment_history` table with the following information:

- `history_id`: Unique identifier
- `patient_id`: Reference to patient
- `treatment_type`: medication | procedure | investigation
- `order_id`: Reference to original treatment order
- `treatment_name`: Name of treatment
- `scheduled_time`: Originally scheduled time
- `completed_at`: Actual completion timestamp
- `completed_by`: Staff member who completed it
- `notes`: Additional observations
- `created_at`: When the record was created

---

## Using History for Review

### Quality Assurance

Review treatment history to:
- Verify medications were given on time
- Check if procedures were performed as scheduled
- Confirm investigations were completed
- Identify patterns of delays or issues

### Timeline Analysis

The timeline view shows:
- **Chronological order**: Most recent treatments first
- **Completion status**: Visual indicators for on-time, early, or late
- **Time differences**: Exact number of minutes early or late

---

## Technical Details

### API Endpoint

Treatment history is retrieved via:
```
GET /api/treatment-history/:patientId
```

This endpoint returns an array of all treatment history records for the specified patient, ordered by completion time (most recent first).

### Data Source

All treatment history data comes directly from the Supabase database. The system does not use any hardcoded or mock data for treatment history records.

---

## Current Limitations

The current implementation provides basic treatment history viewing. Future enhancements may include:
- Filtering by date range, treatment type, or staff member
- Export functionality for reports
- Integration with patient detail modals
- Advanced search capabilities
- Bulk report generation

---

## Related Documentation

- [Master Data Management Guide](MASTER_DATA_GUIDE.md) - Managing medications, procedures, and investigations
- [Developer Guide](DEVELOPER_GUIDE.md) - Technical implementation details
- [Database Setup Guide](DATABASE_SETUP.md) - Database schema and configuration
- [README](README.md) - General Ward Watch documentation
