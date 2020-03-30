const _ = require('lodash');

class Cookie {

	constructor(obj)
	{
		this.name = null;
		this.value = null;
		this.expires = null;
		this.maxAge = null;
		this.path = null;
		this.domain = null;
		this.secure = null;
		this.httpOnly = null;
		this.sameSite = null;

//		if ((obj != null) && (obj instanceof Cookie)) this.parseFromString(obj.toFullString());
		if ((obj != null) && (_.isObject(obj))) this.parseFromObject(obj);
		if ((obj != null) && (_.isString(obj))) this.parseFromString(obj);
	}

	toString()
	{
		return `${this.name}=${this.value};`;
	}

	toFullString()
	{
		let c = this.toString() + ' ';
		if (this.expires != null) c += `Expires=${(_.isDate(this.expires))?this.expires.toGMTString():(new Date(this.expires).toGMTString())}; `;
		if (this.maxAge != null) c+= `Max-Age=${this.maxAge}; `;

		if (_.startsWith(this.name,'__Host'))
			c+= `Path=/; `;
		else if (this.path != null)
			c+= `Path=${this.path}; `;

		if ((this.domain != null) && (!_.startsWith(this.name,'__Host'))) c+= `Domain=${this.domain}; `;
		if ((this.secure == true) || (_.startsWith(this.name,'__Secure')) || (_.startsWith(this.name,'__Host'))) c+= `Secure; `;
		if (this.httpOnly == true) c+= `HttpOnly; `;
		if (this.sameSite != null) c+= `SameSite=${sameSite}; `;

		return c.trim();
	}

	parseFromString(input)
	{
		let parts = input.split(";");
		_(parts).forEach((item, index) => {
			let items = item.split("=");
			items[1] = item.slice(items[0].length + 1);
//			console.log("'",items[0].toLowerCase().trim(), "'  : ",items[0].toLowerCase().trim() === 'httponly', "     ", items[1]);
			if (index == 0)
			{
				this.name = items[0];
				this.value = items[1];
			}
			else if (items[0].toLowerCase().trim() == 'expires') { this.expires = new Date(items[1]); }
			else if (items[0].toLowerCase().trim() == 'max-age') { this.maxAge = items[1]; }
			else if (items[0].toLowerCase().trim() == 'path') { this.path = items[1]; }
			else if (items[0].toLowerCase().trim() == 'domain') { this.domain = items[1]; }
			else if (items[0].toLowerCase().trim() == 'secure') { this.secure = true; }
			else if (items[0].toLowerCase().trim() == 'httponly') { this.httpOnly = true; }
			else if (items[0].toLowerCase().trim() == 'samesite') { this.sameSite = items[1]; }
		});

		if (_.startsWith(this.name,'__Secure')) { this.secure = true; }
		if (_.startsWith(this.name,'__Host')) {
			this.secure = true;
			this.path = '/';
			this.domain = null;
		}
	}

	parseFromObject(obj)
	{
		this.name = obj.name;
		this.value = obj.value;
		this.expires = obj.expires;
		this.maxAge = obj.maxAge;
		this.path = obj.path;
		this.domain = obj.domain;
		this.secure = obj.secure;
		this.httpOnly = obj.httpOnly;
		this.sameSite = obj.sameSite;
	}

	toJSON()
	{
		return _.pickBy({
			name: this.name,
			value: this.value,
			expires: this.expires,
			maxAge: this.maxAge,
			path: this.path,
			domain: this.domain,
			secure: this.secure,
			httpOnly: this.httpOnly,
			sameSite: this.sameSite
		}, (v) => { return ((v !== '') && (v !== null)); });
	}

}

module.exports=Cookie;
