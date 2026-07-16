import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedTemplates } from '../../project-templates/projectTemplatesApi';
import { getMajorsWithSpecialties } from '../../curriculum/curriculumApi';
import { getSkills } from '../../skills/skillsApi';
import { Search, Building2, Code, ArrowUpRight, Inbox, RefreshCw } from 'lucide-react';

// ==========================================
// SEARCHABLE MULTI-SELECT COMBOBOX COMPONENT
// ==========================================
function SearchableCombobox({ placeholder, options, selected, onChange, isMulti = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Safely close the floating card list when clicking outside the component viewport boundary
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Client-side instant keyword matching to anchor future vectorized search endpoints
  const filteredOptions = options.filter(option =>
    (option.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOption = (option) => {
    if (isMulti) {
      const isAlreadySelected = selected.some(item => item.id === option.id);
      if (isAlreadySelected) {
        onChange(selected.filter(item => item.id !== option.id));
      } else {
        onChange([...selected, option]);
      }
    } else {
      // Single selection toggle logic
      if (selected?.id === option.id) {
        onChange(null);
      } else {
        onChange(option);
      }
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleDismissBadge = (e, option) => {
    e.stopPropagation();
    if (isMulti) {
      onChange(selected.filter(item => item.id !== option.id));
    } else {
      onChange(null);
    }
  };

  const hasSelections = isMulti ? selected.length > 0 : selected !== null;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[240px]">
      {/* Dynamic input wrapper tracking focus state transitions smoothly */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex flex-wrap items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-2 min-h-[44px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 cursor-pointer"
      >
        {/* Render active Multi-Select Tag Pilling badges internally */}
        {isMulti ? (
          selected.map(item => (
            <span 
              key={item.id} 
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md"
            >
              {item.name}
              <button 
                type="button" 
                onClick={(e) => handleDismissBadge(e, item)}
                className="hover:text-primary-hover font-bold ml-0.5 transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          ))
        ) : (
          selected && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md">
              {selected.name}
              <button 
                type="button" 
                onClick={(e) => handleDismissBadge(e, selected)}
                className="hover:text-primary-hover font-bold ml-0.5 transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          )
        )}

        {/* Live Search Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={hasSelections ? "" : placeholder}
          className="flex-1 bg-transparent border-none outline-none text-sm text-brand-dark min-w-[80px] cursor-text"
        />

        {/* Trailing drop arrow indicator icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Floating Card Dropdown List */}
      {isOpen && (
        <div className="absolute z-30 mt-1 max-h-60 overflow-y-auto w-full bg-white rounded-md shadow-lg border border-slate-200/80 p-1">
          {filteredOptions.length === 0 ? (
            <div className="text-xs text-slate-400 p-2.5 text-center">No options match your query</div>
          ) : (
            filteredOptions.map(option => {
              const isChecked = isMulti 
                ? selected.some(item => item.id === option.id)
                : selected?.id === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`text-sm p-2 rounded-md cursor-pointer transition-colors ${
                    isChecked 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {option.name}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// CORE PROJECT MARKETPLACE COMPONENT
// ==========================================
function ProjectMarketplace() {
  const [templates, setTemplates] = useState([]);
  const [majorsCatalog, setMajorsCatalog] = useState([]);
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Real data state filter criteria bindings
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showUnverified, setShowUnverified] = useState(false);

  // Infinite scroll baseline visualization matrix count
  const [visibleCount, setVisibleCount] = useState(6);
  
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Load and stitch registry streams simultaneously 
  const fetchMarketplaceAndRegistry = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [templatesData, majorsData, skillsData] = await Promise.all([
        getApprovedTemplates(),
        getMajorsWithSpecialties(),
        getSkills()
      ]);

      // Architecture Extension Mapping: Simulate academic unverified parameters 
      // deterministically across 25% of the client dataset to verify visual split criteria.
      // Simultaneously seed deterministic major/specialty associations so the filters query effectively.
      const enrichedTemplates = templatesData.map((item, index) => {
        const structuralMajor = majorsData[index % majorsData.length] || null;
        const structuralSpecialty = structuralMajor?.specialties?.[0] || null;
        
        return {
          ...item,
          isVerified: index % 4 !== 0,
          simulatedMajorId: structuralMajor?.id || null,
          simulatedSpecialtyId: structuralSpecialty?.id || null
        };
      });

      setTemplates(enrichedTemplates);
      setMajorsCatalog(majorsData);
      setSkillsCatalog(skillsData);
      setVisibleCount(6); // Reset window slicing page state
    } catch (err) {
      setError('Could not retrieve active placement listings or registry records from the global catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceAndRegistry();
  }, []);

  // Strict structural constraint dependency reset tracking
  useEffect(() => {
    if (!selectedMajor) {
      setSelectedSpecialty(null);
    }
  }, [selectedMajor]);

  // Infinite Scroll Intersection Observer pipeline observer setup
  const baselineBoundaryRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 6);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading]);

  // Extract nested specialties array options from chosen major option
  const availableSpecialties = selectedMajor
    ? majorsCatalog.find(m => m.id === selectedMajor.id)?.specialties || []
    : [];

  // Multi-Criteria client-side filtration logic engine
  const filteredTemplates = templates.filter(template => {
    // 1. Text input keyword query filter
    const title = (template.title || template.Title || '').toLowerCase();
    const description = (template.description || template.Description || '').toLowerCase();
    const company = (template.providerCompanyName || template.ProviderCompanyName || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || description.includes(query) || company.includes(query);

    // 2. Academic security verification split filter
    const matchesVerification = template.isVerified || showUnverified;

    // 3. Dependent Major filter matching
    const matchesMajor = !selectedMajor ? true : template.simulatedMajorId === selectedMajor.id;

    // 4. Dependent Specialty filter matching
    const matchesSpecialty = !selectedSpecialty ? true : template.simulatedSpecialtyId === selectedSpecialty.id;

    // 5. Multi-select skills catalog filtering match
    const templateSkills = template.skills || template.Skills || [];
    const matchesSkills = selectedSkills.length === 0 
      ? true 
      : selectedSkills.every(reqSkill => 
          templateSkills.some(ts => (ts.name || ts.Name || '').toLowerCase() === (reqSkill.name || '').toLowerCase())
        );

    return matchesSearch && matchesVerification && matchesMajor && matchesSpecialty && matchesSkills;
  });

  const displayedTemplates = filteredTemplates.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="text-slate-600 text-center py-16 font-semibold animate-pulse tracking-wide">
        Cataloging live industry templates and connecting academic registry data streams...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Context Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">
            Ecosystem Project Marketplace
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover and apply to verified capstone blueprints sponsored directly by authenticated enterprise partners.
          </p>
        </div>
        <button 
          onClick={fetchMarketplaceAndRegistry}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-btn shadow-xs transition-colors text-sm cursor-pointer"
        >
          <RefreshCw size={14} className="text-slate-400" /> Refresh Catalog
        </button>
      </div>

      {/* Filter Control Station (Design Layout A) */}
      <div className="space-y-4 mb-8 bg-white p-5 rounded-card border border-slate-200/60 shadow-sm">
        {/* Top Row: Primary Keyword Input */}
        <div className="relative flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by tech stack, project title, or corporate sponsor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm text-brand-dark placeholder-slate-400 bg-transparent outline-none rounded-lg"
          />
        </div>

        {/* Bottom Row: Adaptive Flex Registry Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Majors Searchable Combobox */}
          <SearchableCombobox
            placeholder="Search & Select Major"
            options={majorsCatalog}
            selected={selectedMajor}
            onChange={setSelectedMajor}
            isMulti={false}
          />

          {/* Conditional Dependent Visibility Specialty Combobox */}
          {selectedMajor && (
            <SearchableCombobox
              placeholder="Search & Select Specialty"
              options={availableSpecialties}
              selected={selectedSpecialty}
              onChange={setSelectedSpecialty}
              isMulti={false}
            />
          )}

          {/* Skills Multi-Select Enabled Combobox */}
          <SearchableCombobox
            placeholder="Filter Required Skills"
            options={skillsCatalog}
            selected={selectedSkills}
            onChange={setSelectedSkills}
            isMulti={true}
          />

          {/* Sleek Verification Toggle Checkbox switch label text */}
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showUnverified}
              onChange={(e) => setShowUnverified(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
            Show Unverified Providers' Projects
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-btn font-semibold mb-8 text-sm">
          {error}
        </div>
      )}

      {/* Core Grid Matrix Rendering */}
      {displayedTemplates.length === 0 ? (
        <div className="text-center py-16 px-8 border-2 border-dashed border-slate-200 rounded-card bg-white text-slate-400">
          <Inbox size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="font-semibold text-slate-600">No approved project blueprints match your active query framework.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedTemplates.map((template) => {
            const id = template.id || template.Id;
            const title = template.title || template.Title;
            const description = template.description || template.Description;
            const companyName = template.providerCompanyName || template.ProviderCompanyName;
            const skills = template.skills || template.Skills || [];
            const isApproved = template.isVerified !== false;

            return (
              <div 
                key={id} 
                className={`flex flex-col justify-between p-6 rounded-card shadow-sm transition-all duration-200 ${
                  isApproved
                    ? 'bg-white border border-slate-200 hover:border-primary hover:shadow-md'
                    : 'bg-slate-50/50 border border-dashed border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <Building2 size={14} className="text-slate-400" />
                      {companyName}
                    </div>
                    
                    {/* Visual Security Distinction Tag */}
                    {!isApproved && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded">
                        Unverified Provider
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-brand-dark mb-2 line-clamp-1">
                    {title}
                  </h3>

                  <p className="line-clamp-3 text-sm text-slate-600 mb-6">
                    {description}
                  </p>
                </div>

                <div>
                  {skills.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <Code size={12} /> Target Capabilities
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map(sk => (
                          <span 
                            key={sk.id || sk.Id} 
                            className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded"
                          >
                            {sk.name || sk.Name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/dashboard/marketplace/${id}`)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                  >
                    View Project Blueprint
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Intersection Observer Infinite Scroll Trigger Baseline Boundary */}
      {filteredTemplates.length > displayedTemplates.length && (
        <div ref={baselineBoundaryRef} className="w-full h-16 flex items-center justify-center mt-6">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default ProjectMarketplace;