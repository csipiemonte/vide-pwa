<template>
  <div>
    <UserHeader />
    <router-view></router-view>
  </div>
</template>

<script>
import UserHeader from "@/components/user/UserHeader";

export default {
  name: "UserHome",
  components: { UserHeader }
};
</script>
