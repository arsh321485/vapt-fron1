<template>
  <div class="mb-4 position-relative">
    <label class="form-label required">{{ label }}</label>
    <input
      :type="showPasswordLocal ? 'text' : 'password'"
      class="form-control"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :required="required"
    />
    <i
      class="bi"
      :class="showPasswordLocal ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
      @click="togglePasswordVisibility"
      style="position:absolute; top:42px; right:20px; cursor:pointer;"
    ></i>

    <!-- Validation Hints (only shown for signup when showValidation is true) -->
    <div v-if="showValidation && modelValue" class="validation-hints mt-2">
      <div class="hint-item" :class="{ valid: validation.minLength }">
        <i class="bi" :class="validation.minLength ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
        <span>At least 8 characters</span>
      </div>
      <div class="hint-item" :class="{ valid: validation.hasUppercase }">
        <i class="bi" :class="validation.hasUppercase ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
        <span>One uppercase letter</span>
      </div>
      <div class="hint-item" :class="{ valid: validation.hasSpecialChar }">
        <i class="bi" :class="validation.hasSpecialChar ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
        <span>One special character</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Password'
    },
    placeholder: {
      type: String,
      default: 'Enter your password'
    },
    showValidation: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'validation-change'],
  data() {
    return {
      showPasswordLocal: false,
      validation: {
        minLength: false,
        hasUppercase: false,
        hasSpecialChar: false
      }
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPasswordLocal = !this.showPasswordLocal;
    },
    handleInput(event) {
      const value = event.target.value;
      this.$emit('update:modelValue', value);

      if (this.showValidation) {
        this.validatePassword(value);
      }
    },
    validatePassword(password) {
      this.validation.minLength = password.length >= 8;
      this.validation.hasUppercase = /[A-Z]/.test(password);
      this.validation.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      this.$emit('validation-change', this.validation);
    }
  },
  watch: {
    modelValue(newValue) {
      if (this.showValidation) {
        this.validatePassword(newValue);
      }
    }
  }
}
</script>

<style scoped>
.validation-hints {
  font-size: 13px;
  padding-left: 10px;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #6c757d;
  transition: color 0.3s ease;
}

.hint-item.valid {
  color: #198754;
}

.hint-item i {
  font-size: 14px;
}

.hint-item span {
  font-size: 13px;
}
.form-label.required::after {
  content: " *";
  color: #dc3545; /* Bootstrap danger red */
  /* font-weight: 600; */
}
.form-label {
  
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}
</style>
