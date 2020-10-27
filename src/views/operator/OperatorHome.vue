<template>
  <div>
    <OperatorHeader v-show="$route.name !== 'operator-login'" />
    <router-view></router-view>
  </div>
</template>

<script>
import OperatorHeader from "@/components/operator/OperatorHeader";

export default {
  name: "OperatorHome",
  components: { OperatorHeader }
};
</script>
