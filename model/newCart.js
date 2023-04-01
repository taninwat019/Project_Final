module.exports.newCart = function Cart(oldCart) {
    this.records = oldCart.records || {} ;
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = (item, qty) => {
        let record = this.records[item.id];
        // console.log(this.records)
        if (record == null) {
            // console.log("Create new record")
            const newRec = {item , qty} ;
            this.records[item.id] = newRec;

        } else {
            // console.log("Push record")
            this.records[item.id].qty += qty;
        }
        this.totalQty += qty;
        this.totalPrice += (item.price * qty);

        // console.log(this.records)
    }

    this.remove = (id) => {
        let record = this.records[id];
        if (record) {
            const removedQty = Number(record.qty);
            this.totalQty -= removedQty;
            this.totalPrice = this.totalPrice - (record.item.price * removedQty) ;
            delete this.records[id];
        }
    }

    this.set = ( newRecords ) => {
        this.records = newRecords;
        this.reloadCart() ;
    }

    this.reloadCart = () => {
        let newTotalQty = 0 ;
        let newTotalPrice = 0 ;
        this.records.forEach( record => {
            // console.log(record)
            newTotalQty += record.qty;
            newTotalPrice += (record.qty * record.item.price);
        })

        this.totalQty = newTotalQty;
        this.totalPrice = newTotalPrice;
    }

    this.toArray = () => {
        let arr = [];
        for(let id in this.records ){
            arr.push(this.records[id])
        }
        return arr ;
    } 

}