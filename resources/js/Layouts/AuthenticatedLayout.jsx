import Dropdown from '@/Components/DropdownMenu';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth, menuItems } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);



    const toggleSubmenu = (itemId) => {
        setOpenSubmenu(openSubmenu === itemId ? null : itemId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
           

            {/* Enhanced Navigation Bar with Glass Effect */}
            <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between px-6">
                         {/* Enhanced Logo with Glow Effect */}
                        <div className="flex items-center">
                            <Link
                                href={route('dashboard')}
                                className="group flex items-center space-x-3 transition-all duration-300 hover:opacity-90"
                            >
                                <div className="relative">
                                    <img
                                        src="https://www.medtalks.in/uploads/img/logo.webp"
                                        alt="Medtalks India"
                                        className="w-32  object-contain transition-all duration-300 group-hover:scale-105 relative z-10"
                                    />
                                    <div className="absolute inset-0 bg-[#00895f]/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                </div>
                               
                            </Link>
                        </div>
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:space-x-2">
                            {/* Dashboard */}
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                className="group relative flex items-center"
                            >
                                <div className={`flex items-center space-x-2 px-4 py-4 text-sm transition-all duration-200 ${route().current('dashboard')
                                        ? 'text-[#00895f] font-medium'
                                        : 'text-gray-700 hover:text-[#00895f] font-normal'
                                    }`}>
                                    <span>Dashboard</span>
                                </div>
                            </NavLink>

                            {/* Content Menu - Dropdown with Seminar, Episodes, FAQ */}
                            <div
                                className="group relative"
                                onMouseEnter={() => setOpenDesktopDropdown('content')}
                                onMouseLeave={() => setOpenDesktopDropdown(null)}
                            >
                                <button className={`flex items-center space-x-2 px-4 py-4 text-sm transition-all duration-200 h-full ${route().current('episodes.*')
                                        ? 'text-[#00895f] font-medium'
                                        : 'text-gray-700 hover:text-[#00895f] font-normal'
                                    }`}>
                                  
                                    <span>Content</span>
                                    <i className={`fa fa-angle-down text-xs transition-transform duration-200 ${openDesktopDropdown === 'content' ? 'rotate-180' : ''
                                        }`}></i>
                                </button>

                                {/* Enhanced Content Dropdown Menu */}
                                <div className={`absolute left-0 z-50 mt-2 w-72 origin-top-left transition-all duration-300 ${openDesktopDropdown === 'content'
                                        ? 'opacity-100 translate-y-0 visible scale-100'
                                        : 'opacity-0 -translate-y-4 invisible scale-95'
                                    }`}>
                                    <div className="overflow-hidden rounded-xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-gray-200 border border-gray-100">
                                      
                                        <div className="py-1">
                                            <Link
                                                href={route('episodes.index')}
                                                className="group flex items-center px-5 py-4 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border-b border-gray-100 relative overflow-hidden"
                                            >
                                                
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 group-hover:text-[#00895f] transition-colors duration-200">Episodes</div>
                                                    <div className="text-xs text-gray-500 group-hover:text-gray-600">Manage video episodes and content</div>
                                                </div>
                                                <i className="fa fa-arrow-right text-gray-400 group-hover:text-[#00895f] group-hover:translate-x-1 transition-all duration-200"></i>
                                            </Link>
                                            <Link
                                                href={route('seminars.index')}
                                                className="group flex items-center px-5 py-4 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border-b border-gray-100 relative overflow-hidden"
                                            >

                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 group-hover:text-[#00895f] transition-colors duration-200">Seminar</div>
                                                    <div className="text-xs text-gray-500 group-hover:text-gray-600">Educational seminars and workshops</div>
                                                </div>
                                                <i className="fa fa-arrow-right text-gray-400 group-hover:text-[#00895f] group-hover:translate-x-1 transition-all duration-200"></i>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="group flex items-center px-5 py-4 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 relative overflow-hidden"
                                            >
                                                
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 group-hover:text-[#00895f] transition-colors duration-200">FAQ</div>
                                                    <div className="text-xs text-gray-500 group-hover:text-gray-600">Frequently asked questions</div>
                                                </div>
                                                <i className="fa fa-arrow-right text-gray-400 group-hover:text-[#00895f] group-hover:translate-x-1 transition-all duration-200"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Menu Items with Enhanced Dropdowns */}
                            {menuItems && menuItems.map((item) => (
                                item.children && item.children.length > 0 ? (
                                    <div
                                        key={item.id}
                                        className="group relative"
                                        onMouseEnter={() => setOpenDesktopDropdown(item.id)}
                                        onMouseLeave={() => setOpenDesktopDropdown(null)}
                                    >
                                        <button className={`flex items-center space-x-2 px-4 py-4 text-sm transition-all duration-200 ${openDesktopDropdown === item.id
                                                ? 'text-[#00895f] font-medium'
                                                : 'text-gray-700 hover:text-[#00895f] font-normal'
                                            }`}>
                                            {item.icon && <i className={`${item.icon} text-base`}></i>}
                                            <span>{item.title}</span>
                                            <i className={`fa fa-angle-down text-xs transition-transform duration-200 ${openDesktopDropdown === item.id ? 'rotate-180' : ''
                                                }`}></i>
                                        </button>

                                        {/* Enhanced Dropdown Menu */}
                                        <div className={`absolute left-0 z-50 mt-0 w-56 origin-top-left transition-all duration-200 ${openDesktopDropdown === item.id
                                                ? 'opacity-100 translate-y-0 visible'
                                                : 'opacity-0 -translate-y-2 invisible'
                                            }`}>
                                            <div className="overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-gray-200">
                                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 border-b border-gray-200">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#00895f]">
                                                        {item.title}
                                                    </p>
                                                </div>
                                                <div className="py-1">
                                                    {item.children.map((child, index) => (
                                                        <Link
                                                            key={child.id}
                                                            href={`/?page=${child.title}`}
                                                            className={`group flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-emerald-50 ${index !== item.children.length - 1 ? 'border-b border-gray-100' : ''
                                                                }`}
                                                        >
                                                            <i className="fa fa-angle-right mr-2 text-xs text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-[#00895f]"></i>
                                                            <span className="font-medium text-gray-900 group-hover:text-[#00895f]">{child.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.id}
                                        href={`/?page=${item.title}`}
                                        className="flex items-center space-x-2 px-4 py-4 text-sm font-normal text-gray-700 transition-all duration-200 hover:text-[#00895f] hover:font-medium">
                                        {item.icon && <i className={`${item.icon} text-base`}></i>}
                                        <span>{item.title}</span>
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Enhanced Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-xl p-3 text-gray-600 transition-all duration-200 hover:bg-emerald-50 hover:text-[#00895f] focus:outline-none focus:ring-2 focus:ring-[#00895f] focus:ring-offset-2 active:scale-95"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Enhanced Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Enhanced Profile Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-3 rounded-xl  px-4 py-2 transition-all duration-200 hover:shadow-lg hover:bg-white group">
                                        
                                        <div className="hidden text-left lg:block">
                                            <div className="text-sm font-semibold text-gray-800 group-hover:text-[#00895f] transition-colors duration-200">{user.name}</div>
                                            <div className="text-xs text-gray-500">Administrator</div>
                                        </div>
                                        <i className="fa fa-chevron-down hidden text-xs text-gray-500 lg:block transition-transform duration-200 group-hover:text-[#00895f]"></i>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                                                <i className="fa fa-user text-[#00895f]"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Profile</div>
                                                <div className="text-xs text-gray-500">View and edit profile</div>
                                            </div>
                                        </div>
                                    </Dropdown.Link>
                                    <Dropdown.Link href="#">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                                                <i className="fa fa-cog text-blue-600"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Settings</div>
                                                <div className="text-xs text-gray-500">Preferences</div>
                                            </div>
                                        </div>
                                    </Dropdown.Link>
                                    <Dropdown.Link href="#">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
                                                <i className="fa fa-lock text-yellow-600"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Lock screen</div>
                                                <div className="text-xs text-gray-500">Secure your session</div>
                                            </div>
                                        </div>
                                    </Dropdown.Link>
                                    <div className="border-t border-gray-100"></div>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                                                <i className="fa fa-power-off text-red-600"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-red-600">Logout</div>
                                                <div className="text-xs text-gray-500">Sign out of your account</div>
                                            </div>
                                        </div>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Enhanced Mobile Navigation with Animation */}
                <div className={`${showingNavigationDropdown ? 'block animate-fadeIn' : 'hidden'} bg-gradient-to-b from-gray-50 to-white md:hidden border-t border-gray-200`}>
                    <div className="space-y-2 px-4 pb-4 pt-4">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="flex items-center space-x-3 rounded-lg"
                        >
                            <i className="fa fa-dashboard text-base"></i>
                            <span>Dashboard</span>
                        </ResponsiveNavLink>

                        {/* Content Menu - Mobile Dropdown */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <button
                                onClick={() => toggleSubmenu('content')}
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-[#00895f]"
                            >
                                <span className="flex items-center space-x-3">
                                    <i className="fa fa-th-large text-base"></i>
                                    <span>Content</span>
                                </span>
                                <i className={`fa fa-angle-${openSubmenu === 'content' ? 'up' : 'down'} text-sm transition-all duration-200 ${openSubmenu === 'content' ? 'text-[#00895f]' : ''
                                    }`}></i>
                            </button>
                            {openSubmenu === 'content' && (
                                <div className="border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                                    <ResponsiveNavLink
                                        href={route('episodes.index')}
                                        className="flex items-center space-x-3 pl-12 border-b border-gray-100"
                                    >
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">Episodes</div>
                                            <div className="text-xs text-gray-600">Manage video episodes</div>
                                        </div>
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href="#"
                                        className="flex items-center space-x-3 pl-12 border-b border-gray-100"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                                            <i className="fa fa-graduation-cap text-purple-600 text-sm"></i>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">Seminar</div>
                                            <div className="text-xs text-gray-600">Seminar management</div>
                                        </div>
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href="#"
                                        className="flex items-center space-x-3 pl-12"
                                    >
                                       
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">FAQ</div>
                                            <div className="text-xs text-gray-600">Frequently asked questions</div>
                                        </div>
                                    </ResponsiveNavLink>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Mobile Menu Items */}
                        {menuItems && menuItems.map((item) => (
                            <div key={item.id}>
                                {item.children && item.children.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                        <button
                                            onClick={() => toggleSubmenu(item.id)}
                                            className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <span className="flex items-center space-x-3">
                                                {item.icon && <i className={`${item.icon} text-base`}></i>}
                                                <span>{item.title}</span>
                                            </span>
                                            <i className={`fa fa-angle-${openSubmenu === item.id ? 'up' : 'down'} text-sm transition-transform duration-200`}></i>
                                        </button>
                                        {openSubmenu === item.id && (
                                            <div className="border-t border-gray-200 bg-gray-50">
                                                {item.children.map((child, index) => (
                                                    <ResponsiveNavLink
                                                        key={child.id}
                                                        href={`/?page=${child.title}`}
                                                        className={`flex items-center space-x-3 pl-12 ${index !== item.children.length - 1 ? 'border-b border-gray-100' : ''
                                                            }`}
                                                    >
                                                        <i className="fa fa-angle-right text-xs text-gray-400"></i>
                                                        <span>{child.title}</span>
                                                    </ResponsiveNavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <ResponsiveNavLink
                                        href={`/?page=${item.title}`}
                                        className="flex items-center space-x-3 rounded-lg"
                                    >
                                        {item.icon && <i className={`${item.icon} text-base`}></i>}
                                        <span>{item.title}</span>
                                    </ResponsiveNavLink>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-300 bg-white pb-3 pt-4">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00895f&color=fff&bold=true`}
                                    alt={user.name}
                                    className="h-12 w-12 rounded-full border-2 border-[#00895f] shadow-sm"
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-semibold text-gray-900">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="flex items-center space-x-3 rounded-lg"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                                    <i className="fa fa-user text-[#00895f]"></i>
                                </div>
                                <span className="font-medium">Profile</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="flex items-center space-x-3 rounded-lg"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                                    <i className="fa fa-power-off text-red-600"></i>
                                </div>
                                <span className="font-medium text-red-600">Log Out</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )} */}

            <main>{children}</main>
        </div>
    );
}
