using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ToyRepository : IToyRepository
{
    private readonly AppDbContext _context;

    public ToyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Toy>> GetAllAsync()
    {
        return await _context.Toys.ToListAsync();
    }

    public async Task<Toy?> GetByIdAsync(int id)
    {
        return await _context.Toys.FindAsync(id);
    }

    public async Task AddAsync(Toy toy)
    {
        _context.Toys.Add(toy);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Toy toy)
    {
        var existingToy = await _context.Toys.FindAsync(toy.Id);
        if (existingToy == null)
        {
            throw new ArgumentException($"Игрушка с ID {toy.Id} не найдена");
        }
        existingToy.Name = toy.Name;
        existingToy.Description = toy.Description;
        existingToy.Price = toy.Price;
        existingToy.ImageUrl = toy.ImageUrl;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var toy = await _context.Toys.FindAsync(id);
        if (toy != null)
        {
            _context.Toys.Remove(toy);
            await _context.SaveChangesAsync();
        }
    }
}