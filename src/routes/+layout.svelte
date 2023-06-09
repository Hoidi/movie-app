<script lang="ts">
    import { page } from '$app/stores';
    import {
        Chevron,
        DarkMode,
        Dropdown,
        DropdownItem,
        Footer,
        FooterLink,
        FooterLinkGroup,
        Navbar,
        NavBrand,
        NavHamburger,
        NavLi,
        NavUl,
    } from 'flowbite-svelte';
    import '../app.postcss';

    $: path = $page.url.pathname;
</script>

<div class="layout">
    <div class="relative">
        <Navbar
            navClass="px-2 sm:px-4 py-2.5 absolute w-full z-20 top-0 left-0 border-b sticky"
            let:hidden
            let:toggle
        >
            <NavBrand href="/">
                {#key localStorage.getItem('color-theme')}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style="height: 55px; width: 70px; margin-right: 20px"
                        ><path
                            d="M 42.5 42.5 l 7.5 0 l 0 -30 l -7.5 -0 Z M 20 42.5 l 7.5 0 l 0 -7.5 l -7.5 -0 Z M 31.25 42.5 l 7.5 0 l 0 -17.5 l -7.5 -0 Z M 4 55 c -2.7 -0 -4 -1.3 -4 -4 l 0 -47 c 0 -2.7 1.3 -4 4 -4 l 62 0 c 2.7 0 4 1.3 4 4 l -0 47 c -0 2.7 -1.3 4 -4 4 Z M 5 50 l 5 0 l 0 -5 l -5 -0 Z M 5 40 l 5 0 l 0 -5 l -5 -0 Z M 5 30 l 5 0 l 0 -5 l -5 -0 Z M 5 20 l 5 0 l 0 -5 l -5 -0 Z M 5 10 l 5 0 l 0 -5 l -5 -0 Z M 60 50 l 5 0 l 0 -5 l -5 -0 Z M 60 40 l 5 0 l 0 -5 l -5 -0 Z M 60 30 l 5 0 l 0 -5 l -5 -0 Z M 60 20 l 5 0 l 0 -5 l -5 -0 Z M 60 10 l 5 0 l 0 -5 l -5 -0 Z M 60 10"
                            fill="#0e7bf9"
                        />
                    </svg>
                {/key}
                <span
                    class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
                >
                    Movie app
                </span>
            </NavBrand>
            <NavHamburger on:click={toggle} />
            <div class="flex flex-row justify-between">
                <NavUl {hidden}>
                    <NavLi href="/" active={path === '/'}>Home</NavLi>
                    <NavLi id="nav-menu1" class="cursor-pointer"
                        ><Chevron aligned>Stats</Chevron></NavLi
                    ><Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
                        <DropdownItem
                            ><NavLi
                                href="/stats/general"
                                active={path === '/stats/general'}
                                >General</NavLi
                            ></DropdownItem
                        >
                        <DropdownItem
                            ><NavLi
                                href="/stats/actor"
                                active={path === '/stats/actor'}>Actor</NavLi
                            ></DropdownItem
                        >
                        <DropdownItem
                            ><NavLi
                                href="/stats/country"
                                active={path === '/stats/country'}
                                >Country of origin</NavLi
                            ></DropdownItem
                        >
                        <DropdownItem
                            ><NavLi
                                href="/stats/director"
                                active={path === '/stats/director'}
                                >Director</NavLi
                            ></DropdownItem
                        >
                        <DropdownItem
                            ><NavLi
                                href="/stats/genre"
                                active={path === '/stats/genre'}>Genre</NavLi
                            ></DropdownItem
                        >
                    </Dropdown>
                    <NavLi href="/diary" active={path === '/diary'}>Diary</NavLi
                    >
                    <NavLi href="/list" active={path === '/list'}>List</NavLi>

                    <NavLi href="/upload" active={path === '/upload'}
                        >Upload</NavLi
                    >
                    <NavLi href="/reset" active={path === '/reset'}>Reset</NavLi
                    >
                </NavUl>
                <DarkMode />
            </div>
        </Navbar>
        <div class="overflow-scroll pb-16 relative">
            <slot />
        </div>
    </div>

    <Footer customClass="footer">
        <FooterLinkGroup
            ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
        >
            <FooterLink href="https://www.themoviedb.org/" target="blank"
                >All data is from The Movie Database</FooterLink
            >
            <FooterLink href="https://github.com/Hoidi/movie-app" target="blank"
                >Source code</FooterLink
            >
        </FooterLinkGroup>
    </Footer>
</div>

<style>
    .layout {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100vh;
    }
</style>
