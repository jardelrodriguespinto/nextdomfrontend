<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const menuItems = [
  { name: 'Produtos', path: '/produtos' },
  { name: 'Movimentações', path: '/movimentacoes' },
  { name: 'Produtos por Tipo', path: '/produtos-por-tipo' },
  { name: 'Lucro', path: '/lucro' }
];
</script>

<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="nav">
      <div class="container nav-container">
        <!-- Logo -->
        <router-link to="/" class="nav-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 7h-7m7 10h-7M5 7h0m0 10h0"/>
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
          NexDom
        </router-link>
        <!-- Navigation Links -->
        <div class="nav-links">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path" 
            class="nav-link"
            :class="{ active: $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container">
      <div class="card">
        <div class="card-header">
          <h1 class="card-title">{{ $route.name }}</h1>
        </div>
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style>
/* Estilos específicos do componente */
</style>
