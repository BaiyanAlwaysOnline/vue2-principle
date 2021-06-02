function proxy(vm, target, k) {
    Object.defineProperty(vm, k, {
        get() {
            return vm[target][k]
        },
        set(newValue) {
            vm[target][k] = newValue;
        }
    })
}

export default proxy;