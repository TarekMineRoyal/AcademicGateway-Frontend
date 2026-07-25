import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import SearchableCombobox from '../SearchableCombobox';

describe('SearchableCombobox', () => {
  const sampleFlatOptions = [
    { id: '1', name: 'Alice Smith' },
    { id: '2', fullName: 'Bob Jones' },
    { id: '3', name: 'Charlie Brown' },
  ];

  const samplePaginatedOptions = {
    items: [
      { id: '10', name: 'David Miller' },
      { id: '20', fullName: 'Eva Green' },
    ],
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 2,
  };

  let handleChange;

  beforeEach(() => {
    handleChange = vi.fn();
  });

  describe('Data Normalization (Flat Array vs PaginatedResult)', () => {
    it('renders options correctly when passed a flat array', async () => {
      render(
        <SearchableCombobox
          placeholder="Select user"
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Select user');
      await userEvent.click(input);

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
      expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    });

    it('renders options correctly when passed a PaginatedResult object ({ items: [...] })', async () => {
      render(
        <SearchableCombobox
          placeholder="Select user"
          options={samplePaginatedOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Select user');
      await userEvent.click(input);

      expect(screen.getByText('David Miller')).toBeInTheDocument();
      expect(screen.getByText('Eva Green')).toBeInTheDocument();
    });

    it('safely handles null, undefined, or empty options prop without crashing', async () => {
      const { unmount } = render(
        <SearchableCombobox
          placeholder="Select user"
          options={null}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Select user');
      await userEvent.click(input);
      expect(screen.getByText('No options match your query')).toBeInTheDocument();

      unmount();

      render(
        <SearchableCombobox
          placeholder="Select user"
          options={undefined}
          selected={null}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByPlaceholderText('Select user'));
      expect(screen.getByText('No options match your query')).toBeInTheDocument();
    });
  });

  describe('Search & Filtering (name vs fullName)', () => {
    it('filters options dynamically by matching the "name" property', async () => {
      render(
        <SearchableCombobox
          placeholder="Search..."
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'Alice');

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
      expect(screen.queryByText('Charlie Brown')).not.toBeInTheDocument();
    });

    it('filters options dynamically by matching the "fullName" property', async () => {
      render(
        <SearchableCombobox
          placeholder="Search..."
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'Bob');

      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
    });

    it('performs case-insensitive filter matching', async () => {
      render(
        <SearchableCombobox
          placeholder="Search..."
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'charlie');

      expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    });

    it('displays fallback message when input matches no options', async () => {
      render(
        <SearchableCombobox
          placeholder="Search..."
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'NonExistentUser');

      expect(screen.getByText('No options match your query')).toBeInTheDocument();
    });
  });

  describe('Single-Select Mode Behavior', () => {
    it('selects option, triggers onChange, and closes dropdown in single-select mode', async () => {
      render(
        <SearchableCombobox
          placeholder="Select item"
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByPlaceholderText('Select item'));
      await userEvent.click(screen.getByText('Alice Smith'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(sampleFlatOptions[0]);

      // Dropdown should close automatically after selection
      expect(screen.queryByText('Charlie Brown')).not.toBeInTheDocument();
    });

    it('deselects option (calls onChange with null) when clicking the already selected option', async () => {
      render(
        <SearchableCombobox
          placeholder="Select item"
          options={sampleFlatOptions}
          selected={sampleFlatOptions[0]}
          onChange={handleChange}
        />
      );

      // Open dropdown
      const container = screen.getByText('Alice Smith').closest('div');
      await userEvent.click(container);

      // Click selected item again inside the list
      const dropdownOption = screen.getAllByText('Alice Smith')[1];
      await userEvent.click(dropdownOption);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(null);
    });

    it('dismisses selected item when clicking badge remove button', async () => {
      render(
        <SearchableCombobox
          placeholder="Select item"
          options={sampleFlatOptions}
          selected={sampleFlatOptions[0]}
          onChange={handleChange}
        />
      );

      const removeBtn = screen.getByRole('button', { name: 'Remove Alice Smith' });
      await userEvent.click(removeBtn);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Multi-Select Mode Behavior (isMulti)', () => {
    it('appends selection without closing the dropdown menu', async () => {
      render(
        <SearchableCombobox
          placeholder="Select multiple"
          options={sampleFlatOptions}
          selected={[sampleFlatOptions[0]]}
          onChange={handleChange}
          isMulti={true}
        />
      );

      // Open dropdown
      const input = screen.getByRole('textbox');
      await userEvent.click(input);

      // Click second option
      await userEvent.click(screen.getByText('Bob Jones'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith([
        sampleFlatOptions[0],
        sampleFlatOptions[1],
      ]);

      // Dropdown should remain open
      expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    });

    it('removes item from selection when clicking an already selected option in dropdown list', async () => {
      const selected = [sampleFlatOptions[0], sampleFlatOptions[1]];

      render(
        <SearchableCombobox
          placeholder="Select multiple"
          options={sampleFlatOptions}
          selected={selected}
          onChange={handleChange}
          isMulti={true}
        />
      );

      const input = screen.getByRole('textbox');
      await userEvent.click(input);

      // Click 'Alice Smith' in option list to uncheck
      const aliceInList = screen.getAllByText('Alice Smith')[1];
      await userEvent.click(aliceInList);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith([sampleFlatOptions[1]]);
    });

    it('removes item from selection when clicking badge dismiss button in multi-select', async () => {
      const selected = [sampleFlatOptions[0], sampleFlatOptions[1]];

      render(
        <SearchableCombobox
          placeholder="Select multiple"
          options={sampleFlatOptions}
          selected={selected}
          onChange={handleChange}
          isMulti={true}
        />
      );

      const removeAliceBtn = screen.getByRole('button', { name: 'Remove Alice Smith' });
      await userEvent.click(removeAliceBtn);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith([sampleFlatOptions[1]]);
    });
  });

  describe('Keyboard & Outside Interactivity', () => {
    it('closes open dropdown menu when pressing Escape key', async () => {
      render(
        <SearchableCombobox
          placeholder="Select item"
          options={sampleFlatOptions}
          selected={null}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByPlaceholderText('Select item'));
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
    });

    it('closes open dropdown menu when clicking outside component container', async () => {
      render(
        <div>
          <button data-testid="outside-button">Outside Element</button>
          <SearchableCombobox
            placeholder="Select item"
            options={sampleFlatOptions}
            selected={null}
            onChange={handleChange}
          />
        </div>
      );

      await userEvent.click(screen.getByPlaceholderText('Select item'));
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside-button'));

      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
    });
  });
});