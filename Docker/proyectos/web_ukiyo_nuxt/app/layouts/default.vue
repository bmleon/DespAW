<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 font-sans text-gray-900 dark:text-zinc-100 transition-colors duration-300 flex flex-col">
    
    <header class="w-full bg-black text-white dark:bg-[#fcfaf7] dark:text-zinc-900 border-b border-zinc-900 dark:border-[#ebdcc5]/40 sticky top-0 z-50 shadow-md transition-colors duration-300">
      <NavBar />
    </header>
    
    <div class="flex-grow">
      <slot />
    </div>

    <footer class="w-full bg-black text-zinc-400 dark:bg-[#fcfaf7] dark:text-zinc-800 border-t-2 border-ukiyo-gold transition-colors duration-300">
      <Footer />
    </footer>
    
  </div>
</template>