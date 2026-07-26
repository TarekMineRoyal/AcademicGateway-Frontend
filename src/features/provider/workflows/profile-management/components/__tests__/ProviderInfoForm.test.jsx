import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProviderInfoForm from '../ProviderInfoForm';

describe('ProviderInfoForm', () => {
  const defaultProps = {
    companyName: 'Acme Corp',
    setCompanyName: vi.fn(),
    websiteUrl: 'https://acme.com',
    setWebsiteUrl: vi.fn(),
    companyDescription: 'A software company.',
    setCompanyDescription: vi.fn(),
  };

  it('renders input fields with provided initial values and description counter', () => {
    render(<ProviderInfoForm {...defaultProps} />);

    expect(screen.getByPlaceholderText(/e\.g\. Acme Corporation/i)).toHaveValue('Acme Corp');
    expect(screen.getByPlaceholderText(/https:\/\/example\.com/i)).toHaveValue('https://acme.com');
    expect(screen.getByPlaceholderText(/Describe your organization/i)).toHaveValue('A software company.');
    expect(screen.getByText('19 / 2000')).toBeInTheDocument();
  });

  it('calls setCompanyName when the company name input changes', () => {
    const setCompanyName = vi.fn();
    render(<ProviderInfoForm {...defaultProps} setCompanyName={setCompanyName} />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Acme Corporation/i);
    fireEvent.change(nameInput, { target: { value: 'Beta Tech' } });

    expect(setCompanyName).toHaveBeenCalledWith('Beta Tech');
  });

  it('calls setWebsiteUrl when the website input changes', () => {
    const setWebsiteUrl = vi.fn();
    render(<ProviderInfoForm {...defaultProps} setWebsiteUrl={setWebsiteUrl} />);

    const urlInput = screen.getByPlaceholderText(/https:\/\/example\.com/i);
    fireEvent.change(urlInput, { target: { value: 'https://betatech.io' } });

    expect(setWebsiteUrl).toHaveBeenCalledWith('https://betatech.io');
  });

  it('calls setCompanyDescription when description input is under max length', () => {
    const setCompanyDescription = vi.fn();
    render(<ProviderInfoForm {...defaultProps} setCompanyDescription={setCompanyDescription} />);

    const textarea = screen.getByPlaceholderText(/Describe your organization/i);
    fireEvent.change(textarea, { target: { value: 'New description' } });

    expect(setCompanyDescription).toHaveBeenCalledWith('New description');
  });

  it('does not call setCompanyDescription if input exceeds the 2000 character limit', () => {
    const setCompanyDescription = vi.fn();
    render(<ProviderInfoForm {...defaultProps} setCompanyDescription={setCompanyDescription} />);

    const overLimitText = 'a'.repeat(2001);
    const textarea = screen.getByPlaceholderText(/Describe your organization/i);
    fireEvent.change(textarea, { target: { value: overLimitText } });

    expect(setCompanyDescription).not.toHaveBeenCalled();
  });
});