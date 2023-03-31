<script lang="ts">
    import { page } from '$app/stores';
    import {
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
    <div class="relative px-8">
        <Navbar
            navClass="px-2 sm:px-4 py-2.5 absolute w-full z-20 top-0 left-0 border-b sticky"
            let:hidden
            let:toggle
        >
            <NavBrand href="/">
                <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    class="mr-3 h-6 sm:h-9"
                    alt="Flowbite Logo"
                />
                <span
                    class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
                    >Movie app</span
                >
            </NavBrand>
            <NavHamburger on:click={toggle} />
            <NavUl {hidden}>
                <NavLi href="/" active={path === '/'}>Home</NavLi>
                <NavLi href="/grid" active={path === '/grid'}>Grid</NavLi>
                <NavLi href="/upload" active={path === '/upload'}>Upload</NavLi>
                <NavLi href="/reset" active={path === '/reset'}>Reset</NavLi>
            </NavUl>
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
